from typing import List, Dict, Any

def chunk_sop_document(title: str, category: str, content: str) -> List[Dict[str, Any]]:
    """Splits SOP document into indexable semantic segments."""
    paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
    chunks = []
    for i, p in enumerate(paragraphs):
        chunks.append({
            "title": f"{title} (Part {i+1})",
            "category": category,
            "content": p
        })
    return chunks

