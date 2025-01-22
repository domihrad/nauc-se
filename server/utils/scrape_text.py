from bs4 import BeautifulSoup
import requests
import re
def scrape_text_utils(url: str):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        headers = [header.get_text(strip=True) for header in soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6"])]
        paragraphs = [para.get_text(strip=True) for para in soup.find_all("p")]
        spans = [span.get_text(strip=True) for span in soup.find_all("span")]

        lists = []
        for ul in soup.find_all(["ul", "ol"]):
            for li in ul.find_all("li"):
                lists.append(li.get_text(strip=True))

        all_text = " ".join(headers + paragraphs + lists + spans)
        words = re.findall(r"[a-zA-Z]+", all_text.lower())
        return words
    except Exception as e:
        print(f"Scraping error: {e}")
        return []
