from typing import Literal, Annotated
from pydantic import Field

SoftSkills = Literal[
    "Communication",
    "Teamwork",
    "Problem Solving",
    "Adaptability",
    "Time Management",
    "Critical Thinking",
    "Creativity",
    "Emotional Intelligence",
    "Leadership",
    "Conflict Resolution",
    "Decision Making",
    "Work Ethic",
    "Attention to Detail",
    "Stress Management",
    "Active Listening",
    "Accountability",
    "Collaboration",
    "Empathy",
    "Negotiation",
    "Self-Motivation",
]

HardSkills = Literal[
    # Finance
    "Financial Analysis",
    "Budgeting and Forecasting",
    "Excel Financial Modeling",
    "Accounting (GAAP / IFRS)",
    "Investment Analysis",
    "Data Analysis for Finance",
    "Risk Management",
    "Cost Accounting",

    # Human Resources (HR)
    "Recruitment and Talent Sourcing",
    "Interviewing Techniques",
    "Onboarding Processes",
    "HR Data & People Analytics",
    "Performance Management",
    "Compensation and Benefits",
    "Employee Relations",
    "Training and Development Design",

    # Code Development
    "Python Programming",
    "SQL and Database Design",
    "REST API Development",
    "Version Control (Git)",
    "Unit Testing and TDD",
    "Object-Oriented Programming (OOP)",
    "Web Development (HTML/CSS/JS)",
    "Cloud Services (e.g., AWS, GCP, Azure)",

    # Business Management
    "Project Management",
    "Business Process Mapping",
    "KPI Definition and Tracking",
    "Strategic Planning",
    "Operations Management",
    "Product Management",
    "Stakeholder Management",
    "Business Requirements Analysis",
]

# Numeric range for skill levels (0–6). Annotated creates a clean alias.
SkillRange = Annotated[float, Field(ge=1.0, le=5.0)]

# Categories for a job position in the organization
PositionCategory = Literal[
    "Tech",
    "HR",
    "Business",
    "Finance",
    "Law",
    "Other",
]
