import pandas as pd
import numpy as np


#extracted skills and levels using chatgpto5
df_job = pd.DataFrame([
    {
        "id": 1,
        "name": "HR",
        "Skills": {
            "Hard Skills": {
                "Recruitment Processes": 5,
                "Employee Onboarding": 4,
                "HRIS Systems": 3,
                "Compensation & Benefits": 4,
                "Labor Law": 5,
                "Performance Management": 4,
                "Employee Engagement Surveys": 3,
                "Data Reporting & Dashboards": 2,
                "Employer Branding": 3,
                "Training & Development Planning": 4
            },
            "Soft Skills": {
                "Communication": 6,
                "Empathy": 6,
                "Conflict Resolution": 5,
                "Negotiation": 4,
                "Active Listening": 6,
                "Teamwork": 4,
                "Discretion & Confidentiality": 5,
                "Stress Management": 3,
                "Adaptability": 3,
                "Public Speaking": 2
            }
        }
    },
    {
        "id": 2,
        "name": "Finances",
        "Skills": {
            "Hard Skills": {
                "Excel": 6,
                "Financial Analysis": 5,
                "Accounting Principles": 5,
                "Budgeting": 4,
                "SQL": 3,
                "Forecasting Models": 4,
                "Regulations & Compliance": 4,
                "Power BI / Tableau": 3,
                "Taxation Basics": 3,
                "Cost Accounting": 2
            },
            "Soft Skills": {
                "Attention to Detail": 6,
                "Analytical Thinking": 5,
                "Risk Awareness": 4,
                "Integrity": 6,
                "Time Management": 4,
                "Communication": 3,
                "Teamwork": 3,
                "Stress Tolerance": 3,
                "Problem Solving": 4,
                "Stakeholder Management": 2
            }
        }
    },
    {
        "id": 3,
        "name": "Diplomat",
        "Skills": {
            "Hard Skills": {
                "International Relations": 5,
                "Policy Writing": 4,
                "Cultural Analysis": 4,
                "Foreign Languages": 5,
                "Negotiation Frameworks": 4,
                "Media Handling": 3,
                "Speech Writing": 3,
                "Conflict Mediation Techniques": 4,
                "Protocol & Etiquette": 5,
                "Geopolitical Analysis": 4
            },
            "Soft Skills": {
                "Diplomacy": 6,
                "Communication": 6,
                "Crisis Management": 4,
                "Emotional Intelligence": 6,
                "Persuasion": 5,
                "Adaptability": 4,
                "Resilience": 4,
                "Networking": 5,
                "Patience": 5,
                "Public Speaking": 4
            }
        }
    },
    {
        "id": 4,
        "name": "Fullstack Developer",
        "Skills": {
            "Hard Skills": {
                "Python": 4,
                "JavaScript": 6,
                "TypeScript": 4,
                "React": 5,
                "Node.js": 5,
                "SQL": 4,
                "NoSQL": 3,
                "REST APIs": 5,
                "GraphQL": 3,
                "HTML/CSS": 5,
                "Testing (Unit/Integration)": 4,
                "Docker": 3,
                "CI/CD Pipelines": 3,
                "Cloud Platforms (AWS/Azure/GCP)": 3
            },
            "Soft Skills": {
                "Problem Solving": 6,
                "Teamwork": 4,
                "Communication": 3,
                "Ownership": 4,
                "Adaptability": 4,
                "Time Management": 3,
                "Self-Learning": 5,
                "Attention to Detail": 3,
                "Collaboration with Non-Tech Stakeholders": 2
            }
        }
    },
    {
        "id": 5,
        "name": "AI Engineer",
        "Skills": {
            "Hard Skills": {
                "Python": 6,
                "Machine Learning": 6,
                "Deep Learning": 5,
                "TensorFlow": 4,
                "PyTorch": 4,
                "Data Engineering": 3,
                "Statistics": 5,
                "MLOps": 3,
                "Vector Databases": 3,
                "Prompt Engineering": 4,
                "Classical ML (Sklearn)": 5,
                "Feature Engineering": 4,
                "Experiment Tracking": 3,
                "Model Evaluation & Metrics": 5
            },
            "Soft Skills": {
                "Analytical Thinking": 6,
                "Problem Solving": 6,
                "Creativity": 4,
                "Communication": 3,
                "Curiosity": 5,
                "Business Understanding": 3,
                "Collaboration": 4,
                "Documentation": 2,
                "Presentation Skills": 2
            }
        }
    },
    {
        "id": 6,
        "name": "Penetration Tester",
        "Skills": {
            "Hard Skills": {
                "Networking": 5,
                "Python": 4,
                "Bash Scripting": 4,
                "Linux": 6,
                "Vulnerability Analysis": 6,
                "OWASP Top 10": 5,
                "Metasploit": 4,
                "Burp Suite": 5,
                "Web Application Security": 5,
                "Threat Modeling": 3,
                "Report Writing": 3,
                "Social Engineering Techniques": 2,
                "Cloud Security Basics": 2
            },
            "Soft Skills": {
                "Critical Thinking": 6,
                "Persistence": 5,
                "Attention to Detail": 5,
                "Communication": 3,
                "Ethical Mindset": 6,
                "Time Management": 3,
                "Stress Tolerance": 3,
                "Curiosity": 4,
                "Team Collaboration": 3
            }
        }
    },
    {
        "id": 7,
        "name": "Strategic Consultant",
        "Skills": {
            "Hard Skills": {
                "Market Analysis": 5,
                "Excel Modeling": 5,
                "PowerPoint Storytelling": 6,
                "Business Strategy": 5,
                "Financial Modeling": 4,
                "Primary Research": 4,
                "Secondary Research": 4,
                "Competitive Analysis": 4,
                "Data Visualization": 3,
                "Basic SQL": 2
            },
            "Soft Skills": {
                "Communication": 6,
                "Presentation Skills": 6,
                "Problem Solving": 5,
                "Leadership": 3,
                "Client Management": 5,
                "Structured Thinking": 6,
                "Time Management": 4,
                "Teamwork": 4,
                "Feedback Handling": 3,
                "Resilience": 3
            }
        }
    },
    {
        "id": 8,
        "name": "Material Engineer",
        "Skills": {
            "Hard Skills": {
                "Material Science": 6,
                "Chemistry": 5,
                "Mechanical Testing": 4,
                "Simulation Tools (FEA)": 4,
                "Quality Control": 4,
                "Data Analysis": 3,
                "CAD Tools": 3,
                "Failure Analysis": 4,
                "Manufacturing Processes": 3,
                "Regulatory Standards": 2
            },
            "Soft Skills": {
                "Attention to Detail": 6,
                "Problem Solving": 5,
                "Analytical Thinking": 5,
                "Teamwork": 4,
                "Technical Writing": 3,
                "Communication": 3,
                "Project Management": 3,
                "Creativity": 3,
                "Collaboration with Production": 2
            }
        }
    }
])
#need to load data from datagen.py after i use api key to generate 10k
df_emp = pd.DataFrame()

print (df_emp.head(20))
print (df_job.head)
