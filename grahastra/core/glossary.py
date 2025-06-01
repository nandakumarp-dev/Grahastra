PLANET_TRANSLATIONS = {
    "Sun": "സൂര്യൻ",
    "Moon": "ചന്ദ്രൻ",
    "Mars": "ചൊവ്വ",
    "Mercury": "ബുധൻ",
    "Jupiter": "ഗുരു",
    "Venus": "ശുക്രൻ",
    "Saturn": "ശനി",
    "Rahu": "റാഹു",
    "Ketu": "കേതു"
}

def get_rashi_name(degree):
    rashis = [
        "മേടം", "ഇടവം", "മിഥുനം", "കർക്കിടകം", "ചിങ്ങം", "കന്നി",
        "തുലാം", "വൃശ്ചികം", "ധനു", "മകരം", "കുംഭം", "മീനം"
    ]
    return rashis[int(degree // 30)]