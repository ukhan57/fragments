# tests/integration/post-fragments-unauthenticated.hurl

# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# We're sending a plain text fragment
Content-Type: text/plain

# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

# 1. We expect to get back an HTTP 201
HTTP/1.1 401

# We have various assertions about the response that we want to check
[Asserts]

# We are expecting a JSON message which is  {"status": "error"}
jsonpath "$.status" == "error"
# We expect to get back a JSON response with { "code": 415}
jsonpath "$.error.code" == 401
# We expect to get back a JSON response with { "message": "Unauthorized"} which is a string
jsonpath "$.error.message" isString
jsonpath "$.error.message" == "Unauthorized"

