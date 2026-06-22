from datetime import date
from enum import Enum
from typing import Annotated

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    HttpUrl,
    field_validator,
    model_validator,
)

SkillText = Annotated[str, Field(min_length=1, max_length=60)]
BulletText = Annotated[str, Field(min_length=1, max_length=300)]
TechnologyText = Annotated[str, Field(min_length=1, max_length=60)]


def _clean_text_list(value: object) -> object:
    if not isinstance(value, list):
        return value

    cleaned: list[str] = []
    for item in value:
        if item is None:
            continue

        text = str(item).strip()
        if text:
            cleaned.append(text)

    return list(dict.fromkeys(cleaned))


# -------------------------
# Enums
# -------------------------


class LanguageLevel(str, Enum):
    beginner = "Beginner"
    intermediate = "Intermediate"
    advanced = "Advanced"
    fluent = "Fluent"
    native = "Native"


# -------------------------
# Shared Base Config
# -------------------------


class BaseSchema(BaseModel):
    model_config = {
        "str_strip_whitespace": True,
        "validate_assignment": True,
        "extra": "forbid",
    }


# -------------------------
# Personal Information
# -------------------------


class PersonalInfo(BaseSchema):
    full_name: Annotated[str, Field(min_length=2, max_length=100)]

    email: EmailStr

    phone: Annotated[
        str,
        Field(
            pattern=r"^\+?[1-9]\d{7,14}$",
            description="International phone number format",
        ),
    ]

    location: Annotated[str, Field(min_length=2, max_length=100)]

    linkedin: HttpUrl | None = None
    github: HttpUrl | None = None
    portfolio: HttpUrl | None = None

    summary: Annotated[str, Field(min_length=30, max_length=500)]


# -------------------------
# Experience
# -------------------------


class Experience(BaseSchema):
    company: Annotated[str, Field(min_length=2, max_length=100)]

    position: Annotated[str, Field(min_length=2, max_length=100)]

    start_date: date
    end_date: date | None = None

    responsibilities: Annotated[list[BulletText], Field(min_length=1, max_length=10)]

    achievements: Annotated[list[BulletText], Field(max_length=10)] = Field(
        default_factory=list
    )

    @field_validator("responsibilities", "achievements", mode="before")
    @classmethod
    def clean_text_lists(cls, value):
        return _clean_text_list(value)

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date and self.end_date < self.start_date:
            raise ValueError("end_date cannot be before start_date")
        return self


# -------------------------
# Education
# -------------------------


class Education(BaseSchema):
    university: Annotated[str, Field(min_length=2, max_length=150)]

    degree: Annotated[str, Field(min_length=2, max_length=100)]

    major: Annotated[str, Field(min_length=2, max_length=100)]

    gpa: Annotated[float | None, Field(ge=0.0, le=4.0)] = None

    start_date: date
    end_date: date | None = None

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date and self.end_date < self.start_date:
            raise ValueError("end_date cannot be before start_date")
        return self


# -------------------------
# Projects
# -------------------------


class Project(BaseSchema):
    name: Annotated[str, Field(min_length=2, max_length=100)]

    description: Annotated[str, Field(min_length=20, max_length=500)]

    technologies: Annotated[list[TechnologyText], Field(min_length=1, max_length=12)]

    link: HttpUrl | None = None

    @field_validator("technologies", mode="before")
    @classmethod
    def clean_technologies(cls, value):
        return _clean_text_list(value)


# -------------------------
# Certifications
# -------------------------


class Certification(BaseSchema):
    name: Annotated[str, Field(min_length=2, max_length=100)]

    organization: Annotated[str, Field(min_length=2, max_length=100)]

    issue_date: date | None = None


# -------------------------
# Languages
# -------------------------


class Language(BaseSchema):
    name: Annotated[str, Field(min_length=2, max_length=50)]

    level: LanguageLevel


# -------------------------
# Main Resume Schema
# -------------------------


class ResumeCreate(BaseSchema):
    personal_info: PersonalInfo

    job_role: Annotated[str, Field(min_length=2, max_length=100)]

    experience: Annotated[list[Experience], Field(max_length=10)] = Field(
        default_factory=list
    )

    education: Annotated[list[Education], Field(max_length=5)] = Field(
        default_factory=list
    )

    skills: Annotated[list[SkillText], Field(min_length=1, max_length=30)]

    projects: Annotated[list[Project], Field(max_length=10)] = Field(
        default_factory=list
    )

    certifications: Annotated[list[Certification], Field(max_length=10)] = Field(
        default_factory=list
    )

    languages: Annotated[list[Language], Field(max_length=10)] = Field(
        default_factory=list
    )

    @field_validator("skills", mode="before")
    @classmethod
    def validate_skills(cls, value):
        cleaned = _clean_text_list(value)

        if not cleaned:
            raise ValueError("At least one skill is required")

        return cleaned
