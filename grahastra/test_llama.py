# import requests

# response = requests.post(
#     "http://localhost:11434/api/generate",
#     json={
#         "model": "llama3",
#         "prompt": "ശനി ഏഴാം ഭാവത്തിൽ എങ്കിൽ എന്താണ് ഫലം?"
#     },
#     stream=True  # <-- Important!
# )

# full_reply = ""
# for line in response.iter_lines():
#     if line:
#         part = line.decode('utf-8')
#         try:
#             full_reply += eval(part).get("response", "")
#         except:
#             continue

# print(full_reply.strip())