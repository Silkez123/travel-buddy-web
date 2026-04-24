import { NextRequest, NextResponse } from "next/server";

const GELATO_API_URL = "https://order.gelatoapis.com/v4/orders";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GELATO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GELATO_API_KEY not configured" }, { status: 500 });
  }

  const body = await req.json();
  const { imageUrl, recipientName, address1, address2, city, postCode, country, email } = body;

  if (!imageUrl || !recipientName || !address1 || !city || !postCode || !country) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const orderPayload = {
    orderType: "order",
    orderReferenceId: `tb-${Date.now()}`,
    customerReferenceId: `tb-customer-${Date.now()}`,
    currency: "USD",
    items: [
      {
        itemReferenceId: `item-${Date.now()}`,
        productUid: "postcard_15x10_170gsm_4-0_hor", // Gelato 6x4" postcard product
        files: [
          {
            type: "default",
            url: imageUrl,
          },
        ],
        quantity: 1,
      },
    ],
    shippingAddress: {
      firstName: recipientName.split(" ")[0] ?? recipientName,
      lastName: recipientName.split(" ").slice(1).join(" ") || "-",
      addressLine1: address1,
      addressLine2: address2 ?? "",
      city,
      postCode,
      country,
      email,
    },
    shipmentMethodUid: "express",
  };

  const res = await fetch(GELATO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify(orderPayload),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.message ?? "Gelato order failed" }, { status: res.status });
  }

  return NextResponse.json({ orderId: data.id, status: data.orderType });
}
