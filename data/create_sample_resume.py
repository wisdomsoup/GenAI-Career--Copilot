#!/usr/bin/env python3
"""
Create a sample resume PDF for testing the GenAI Career Copilot
"""

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def create_sample_resume():
    """Create a sample resume PDF"""
    filename = "sample_resume.pdf"
    doc = SimpleDocTemplate(filename, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=18,
        spaceAfter=30,
        alignment=1  # Center alignment
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=12,
        textColor='blue'
    )
    
    story = []
    
    # Header
    story.append(Paragraph("John Doe", title_style))
    story.append(Paragraph("Software Engineer", styles['Normal']))
    story.append(Paragraph("john.doe@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johndoe", styles['Normal']))
    story.append(Spacer(1, 20))
    
    # Professional Summary
    story.append(Paragraph("PROFESSIONAL SUMMARY", heading_style))
    story.append(Paragraph(
        "Experienced software engineer with 5+ years of experience in full-stack development. "
        "Proficient in JavaScript, Python, and cloud technologies. Strong problem-solving skills "
        "and experience leading development teams.",
        styles['Normal']
    ))
    story.append(Spacer(1, 12))
    
    # Technical Skills
    story.append(Paragraph("TECHNICAL SKILLS", heading_style))
    story.append(Paragraph(
        "<b>Programming Languages:</b> JavaScript, Python, Java, TypeScript<br/>"
        "<b>Frontend:</b> React, Vue.js, HTML5, CSS3, TailwindCSS<br/>"
        "<b>Backend:</b> Node.js, Express, FastAPI, Django<br/>"
        "<b>Databases:</b> MongoDB, PostgreSQL, MySQL<br/>"
        "<b>Cloud & DevOps:</b> AWS, Docker, Kubernetes, CI/CD",
        styles['Normal']
    ))
    story.append(Spacer(1, 12))
    
    # Work Experience
    story.append(Paragraph("WORK EXPERIENCE", heading_style))
    
    story.append(Paragraph("<b>Senior Software Engineer</b> - TechCorp Inc. (2021 - Present)", styles['Normal']))
    story.append(Paragraph(
        "• Developed and maintained web applications using React and Node.js<br/>"
        "• Improved application performance by 40% through code optimization<br/>"
        "• Led a team of 4 developers on multiple projects<br/>"
        "• Implemented CI/CD pipelines reducing deployment time by 60%",
        styles['Normal']
    ))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("<b>Software Engineer</b> - StartupXYZ (2019 - 2021)", styles['Normal']))
    story.append(Paragraph(
        "• Built RESTful APIs using Python and FastAPI<br/>"
        "• Designed and implemented database schemas for user management<br/>"
        "• Collaborated with product team to deliver features on time<br/>"
        "• Wrote comprehensive unit tests achieving 90% code coverage",
        styles['Normal']
    ))
    story.append(Spacer(1, 12))
    
    # Education
    story.append(Paragraph("EDUCATION", heading_style))
    story.append(Paragraph(
        "<b>Bachelor of Science in Computer Science</b><br/>"
        "University of Technology (2015 - 2019)<br/>"
        "GPA: 3.8/4.0",
        styles['Normal']
    ))
    story.append(Spacer(1, 12))
    
    # Projects
    story.append(Paragraph("PROJECTS", heading_style))
    story.append(Paragraph(
        "<b>E-commerce Platform</b> - Personal Project<br/>"
        "• Built a full-stack e-commerce application using React and Node.js<br/>"
        "• Integrated payment processing with Stripe API<br/>"
        "• Deployed on AWS with auto-scaling capabilities",
        styles['Normal']
    ))
    
    # Build PDF
    doc.build(story)
    print(f"✅ Sample resume created: {filename}")
    return filename

if __name__ == "__main__":
    try:
        create_sample_resume()
        print("\n📄 You can now use this sample resume to test the application!")
        print("Upload 'sample_resume.pdf' through the web interface to test resume analysis.")
    except ImportError:
        print("❌ reportlab library not found. Install it with: pip install reportlab")
    except Exception as e:
        print(f"❌ Error creating sample resume: {e}")