from ats_resume_builder.utils.json_repair import repair_json


def test_repairs_markdown_fenced_json() -> None:
    repaired = repair_json('```json\n{"name":"Ada",}\n```')

    assert repaired == {"name": "Ada"}


def test_extracts_json_object_from_text() -> None:
    repaired = repair_json('Here is the JSON: {"ok": true}')

    assert repaired == {"ok": True}
