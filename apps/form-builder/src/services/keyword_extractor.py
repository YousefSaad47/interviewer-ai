class KeywordExtractor:
    def __init__(self):
        self.skills = [
            "python",
            "fastapi",
            "django",
            "postgresql",
            "sql",
            "docker",
            "aws",
            "react",
            "javascript",
            "node",
        ]

    def extract(self, text: str):
        text = text.lower()
        result = []

        for skill in self.skills:
            if skill in text:
                result.append(skill)

        return result
