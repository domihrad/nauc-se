from transformers import pipeline

typeTranslator = pipeline("translation", model="Helsinki-NLP/opus-mt-en-cs")

def translate():
    data = request.get_json()

    text = data.get('text', '')

    if not text:
        return jsonify({"error": "No text provided."}), 400

    # Translate the text
    translated_text = translator(text, max_length=400)[0]['translation_text']
    return jsonify({"translated_text": translated_text})


translate();
