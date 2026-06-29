import re
from datetime import date
from enum import StrEnum
from typing import Annotated

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    HttpUrl,
    field_validator,
    model_validator,
)

NonEmptyStr = Annotated[str, Field(min_length=1, max_length=500)]
ShortStr = Annotated[str, Field(min_length=1, max_length=120)]
LongStr = Annotated[str, Field(min_length=1, max_length=3000)]


class SkillLevel(StrEnum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"
    expert = "expert"


class LanguageLevel(StrEnum):
    basic = "basic"
    conversational = "conversational"
    professional = "professional"
    native = "native"


class DateRange(BaseModel):
    model_config = ConfigDict(extra="forbid")

    start: date | None = None
    end: date | None = None
    current: bool = False

    @model_validator(mode="after")
    def validate_range(self) -> "DateRange":
        if self.end and self.start and self.end < self.start:
            msg = "end date must be greater than or equal to start date"
            raise ValueError(msg)
        if self.current and self.end:
            msg = "current ranges must not include an end date"
            raise ValueError(msg)
        return self


class Link(BaseModel):
    model_config = ConfigDict(extra="forbid")

    label: ShortStr
    url: HttpUrl


class PersonalInformation(BaseModel):
    model_config = ConfigDict(extra="forbid")

    full_name: ShortStr
    email: EmailStr
    phone: Annotated[str | None, Field(default=None, min_length=7, max_length=32)] = None
    location: Annotated[str | None, Field(default=None, max_length=160)] = None
    headline: Annotated[str | None, Field(default=None, max_length=180)] = None
    links: list[Link] = Field(default_factory=list, max_length=8)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        if value is None:
            return value
        if not re.fullmatch(r"[\d\s()+.\-]{7,32}", value):
            msg = "phone must contain only digits, spaces, parentheses, plus, dot, or dash"
            raise ValueError(msg)
        digits = re.sub(r"\D", "", value)
        if len(digits) < 7:
            msg = "phone must include at least 7 digits"
            raise ValueError(msg)
        return value


class ExperienceItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    company: ShortStr
    title: ShortStr
    location: Annotated[str | None, Field(default=None, max_length=160)] = None
    date_range: DateRange
    highlights: list[LongStr] = Field(default_factory=list, min_length=1, max_length=12)


class EducationItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    institution: ShortStr
    degree: ShortStr
    field_of_study: Annotated[str | None, Field(default=None, max_length=160)] = None
    location: Annotated[str | None, Field(default=None, max_length=160)] = None
    date_range: DateRange | None = None
    description: LongStr | None = None
    highlights: list[LongStr] = Field(default_factory=list, max_length=8)


class SkillItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: ShortStr
    level: SkillLevel | None = None
    keywords: list[ShortStr] = Field(default_factory=list, max_length=20)


class ProjectItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: ShortStr
    description: LongStr
    url: HttpUrl | None = None
    highlights: list[LongStr] = Field(default_factory=list, max_length=10)
    technologies: list[ShortStr] = Field(default_factory=list, max_length=20)


class CertificationItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: ShortStr
    issuer: Annotated[str | None, Field(default=None, max_length=160)] = None
    issued_on: date | None = None
    url: HttpUrl | None = None


class LanguageItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: ShortStr
    level: LanguageLevel | None = None


class Resume(BaseModel):
    model_config = ConfigDict(extra="forbid")

    personal_information: PersonalInformation
    professional_summary: Annotated[str | None, Field(default=None, max_length=1800)] = None
    experience: list[ExperienceItem] = Field(default_factory=list, max_length=30)
    education: list[EducationItem] = Field(default_factory=list, max_length=20)
    skills: list[SkillItem] = Field(default_factory=list, max_length=80)
    projects: list[ProjectItem] = Field(default_factory=list, max_length=30)
    certifications: list[CertificationItem] = Field(default_factory=list, max_length=30)
    languages: list[LanguageItem] = Field(default_factory=list, max_length=20)

    @model_validator(mode="after")
    def validate_content(self) -> "Resume":
        has_body = any((self.experience, self.education, self.skills, self.projects))
        if not has_body:
            msg = "resume must include at least one of experience, education, skills, or projects"
            raise ValueError(msg)
        return self


class ResumeBuildRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    resume_id: Annotated[str, Field(alias="resumeId", min_length=1, max_length=120)]
    resume: Resume


class ResumeBuildResponseMetadata(BaseModel):
    resume_id: str
    ai_optimized: bool
