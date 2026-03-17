import os
import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from datetime import datetime

def generate_quote_pdf(items: list, total_cost: float) -> io.BytesIO:
    """
    Legenerál egy professzionális Árajánlat / Anyagkiírás PDF-et a memóriában.
    Visszatérési érték: io.BytesIO objektum (a PDF binary adata).
    
    items formátum list of dicts:
    [
        {"name": "...", "amount": "...", "price": "...", "total": "..."},
        ...
    ]
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm
    )

    elements = []
    styles = getSampleStyleSheet()

    # TTF Betűtípus regisztrálása az ékezetek miatt (ő, ű)
    try:
        pdfmetrics.registerFont(TTFont('Arial', 'C:\\Windows\\Fonts\\arial.ttf'))
        pdfmetrics.registerFont(TTFont('Arial-Bold', 'C:\\Windows\\Fonts\\arialbd.ttf'))
        font_regular = 'Arial'
        font_bold = 'Arial-Bold'
    except Exception:
        font_regular = 'Helvetica'
        font_bold = 'Helvetica-Bold'

    # Stílusok frissítése a magyar fontra
    for name, style in styles.byName.items():
        if hasattr(style, 'fontName'):
            if 'Heading' in name or 'bold' in style.fontName.lower():
                style.fontName = font_bold
            else:
                style.fontName = font_regular

    # Egyedi stílusok
    title_style = ParagraphStyle(
        name='CustomTitle',
        parent=styles['Heading1'],
        fontName=font_bold,
        fontSize=22,
        textColor=colors.HexColor('#c59b27'),
        spaceAfter=5
    )
    
    subtitle_style = ParagraphStyle(
        name='CustomSubTitle',
        parent=styles['Normal'],
        fontName=font_regular,
        fontSize=12,
        textColor=colors.gray,
        spaceAfter=20
    )

    total_style = ParagraphStyle(
        name='TotalStyle',
        parent=styles['Heading2'],
        fontName=font_bold,
        fontSize=16,
        textColor=colors.HexColor('#c59b27'),
        alignment=2,  # Jobbra zárt
        spaceTop=20
    )

    # Fejléc
    elements.append(Paragraph("ÁRAJÁNLAT / ANYAGKIÍRÁS", title_style))
    elements.append(Paragraph("Profi Költségvetés Kalkulátor", subtitle_style))
    
    date_str = datetime.now().strftime("%Y. %m. %d.")
    elements.append(Paragraph(f"<b>Dátum:</b> {date_str}", styles['Normal']))
    elements.append(Spacer(1, 1*cm))

    # Táblázat adatai
    table_data = [
        ["Megnevezés", "Mennyiség", "Egységár (Becsült)", "Összesen"]
    ]
    
    for item in items:
        table_data.append([
            item.get('name', '-'),
            item.get('amount', '-'),
            item.get('price', '-'),
            item.get('total', '-')
        ])

    # Táblázat stílusa
    t = Table(table_data, colWidths=[7*cm, 3*cm, 3.5*cm, 3.5*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.whitesmoke),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#333333')),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),  # Első oszlop balra
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'), # Többi oszlop jobbra
        ('FONTNAME', (0, 0), (-1, 0), font_bold),
        ('FONTNAME', (0, 1), (-1, -1), font_regular),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#dddddd')),
        ('LINEBELOW', (0, 0), (-1, 0), 2, colors.HexColor('#c59b27')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.darkslategray),
    ]))
    
    elements.append(t)

    # Végösszeg
    if total_cost > 0:
        formatted_total = f"{int(total_cost):,} Ft".replace(',', ' ')
        elements.append(Paragraph(f"Becsült Összköltség: <b>{formatted_total}</b>", total_style))

    # Lábjegyzet
    elements.append(Spacer(1, 2*cm))
    footer_text = (
        "Ez egy automatikusan generált, tájékoztató jellegű anyagkiírás és becsült költségvetés.<br/>"
        "Az árak a piacon lévő aktuális mesterséges intelligencia által gyűjtött átlagárakat tükrözik,<br/>"
        "a valós bekerülési árak a kereskedőtől és a vásárlás időpontjától függően eltérhetnek."
    )
    footer_style = ParagraphStyle(
        name='FooterStyle',
        parent=styles['Normal'],
        fontName=font_regular,
        fontSize=9,
        textColor=colors.lightgrey,
        alignment=1 # Középre zárt
    )
    elements.append(Paragraph(footer_text, footer_style))

    # Generálás
    doc.build(elements)
    buffer.seek(0)
    return buffer
