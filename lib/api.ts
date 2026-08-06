export function jsonResponse(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function errorResponse(message = "দুঃখিত, কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।", status = 400) {
  return Response.json({ error: message }, { status });
}
