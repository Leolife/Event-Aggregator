from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

events_titles = [
    {"id": 0,"link":"https://docs.fcc.gov/public/attachments/DOC-408129A1.txt" ,"title":"FCC opens entire 6 GHz band to low power device operations"},
    {"id": 1,"link":"https://www.theguardian.com/us-news/2024/dec/11/new-jersey-drone-sightings-state-of-emergency" ,"title":"Mysterious New Jersey drone sightings prompt call for 'state of emergency'"},
    {"id": 2,"link":"https://gist.github.com/peppergrayxyz/fdc9042760273d137dddd3e97034385f" ,"title":"QEMU with VirtIO GPU Vulkan Support"},
    {"id": 3,"link":"https://www.npr.org/2024/12/10/nx-s1-5222574/kids-character-ai-lawsuit" ,"title":"Chatbot hinted a kid should kill his parents over screen time limits: lawsuit"},
    {"id": 4,"link":"https://joinpeertube.org/news/peertube-app" ,"title":"PeerTube mobile app: discover videos while caring for your attention"},
    {"id": 5,"link":"https://x41-dsec.de/news/2024/12/11/mullvad/" ,"title":"Review of Mullvad VPN"},
    {"id": 6,"link":"https://github.com/luchina-gabriel/OSX-PROXMOX" ,"title":"Instant macOS install on Proxmox including AMD patches"},
    {"id": 7,"link":"https://start.boldvoice.com/accent-guesser" ,"title":"AI Guesses Your Accent"},
    {"id": 8,"link":"https://www.za-zu.com/blog/playbook" ,"title":"The Cold Email Handbook"},
    {"id": 9,"link":"https://xuanwo.io/2024/10-a-letter-to-open-source-maintainers/" ,"title":"A letter to open-source maintainers"},
    {"id": 10,"link":"https://pgroll.com/" ,"title":"Pgroll – Zero-downtime, reversible, schema changes for PostgreSQL (new website)"},
    {"id": 11,"link":"https://www.sifive.com/blog/hifive-premier-p550-development-boards-with-ubuntu" ,"title":"RISC-V HiFive Premier P550 Development Boards with Ubuntu Now Available"},
    {"id": 12,"link":"https://docs.fcc.gov/public/attachments/DOC-408083A1.txt" ,"title":"2400 phone providers may be shut down by the FCC for failing to stop robocalls"},
    {"id": 13,"link":"https://dioxuslabs.com/blog/release-060/" ,"title":"Dioxus 0.6 – Crossplatform apps with Rust"},
    {"id": 14,"link":"https://www.indignity.net/the-washington-post-burns-its-own-archive/","title":"The Washington Post burns its own archive"},
    {"id": 15,"link":"https://cowfreedom.de/#dot_product/introduction/" ,"title":"The GPU is not always faster"},
    {"id": 16,"link":"https://www.ycombinator.com/companies/charge-robotics/jobs/ml4f9l4-senior-mechanical-engineer" ,"title":"Charge Robotics (YC S21) is hiring MechEs to build robots that build solar farms"},
    {"id": 17,"link":"https://computeradsfromthepast.substack.com/p/unix-review-magazine-interviews-larry" ,"title":"Unix Review Magazine Interviews Larry Tesler"},
    {"id": 18,"link":"https://simonwillison.net/2024/Nov/27/storing-times-for-human-events/" ,"title":"Storing Times for Human Events"},
    {"id": 19,"link":"https://blog.google/technology/google-deepmind/google-gemini-ai-update-december-2024/" ,"title":"Gemini 2.0: our new AI model for the agentic era"},
    {"id": 20,"link":"https://www.ntietz.com/blog/evolving-ergo-setup/" ,"title":"Evolving my ergonomic setup (or, my laptop with extra steps)"},
    {"id": 21,"link":"https://worldhistory.substack.com/p/the-myth-of-bananaland" ,"title":"The Myth of Bananaland"},
    {"id": 22,"link":"https://cloud.google.com/blog/products/compute/trillium-tpu-is-ga" ,"title":"Trillium TPU Is GA"},
    {"id": 23,"link":"https://andyatkinson.com/django-python-postgres-busy-rails-developer" ,"title":"Django and Postgres for the Busy Rails Developer"},
    {"id": 24,"link":"https://www.wired.com/story/onlyfans-models-are-using-ai-impersonators-to-keep-up-with-their-dms/" ,"title":"OnlyFans models are using AI impersonators to keep up with their DMs"},
    {"id": 25,"link":"https://www.nytimes.com/2024/12/10/business/media/the-onion-infowars-alex-jones.html" ,"title":"Bankruptcy judge rejects sale of Infowars to The Onion"},
    {"id": 26,"link":"https://developers.redhat.com/articles/2024/12/11/making-memcpynull-null-0-well-defined" ,"title":"Making memcpy(NULL, NULL, 0) well-defined"},
    {"id": 27,"link":"https://www.scimex.org/newsfeed/being-overweight-overtakes-tobacco-smoking-as-the-leading-disease-risk-factor-in-2024" ,"title":"Being overweight overtakes tobacco smoking as the leading disease risk factor"}
]
class event_listings:
    def __init__(self,i):
        self.items = i

event_titles_c = event_listings(i = events_titles)

@app.get("/events")
def get_events():
    return jsonify(event_titles_c.items)

@app.post("/events")
def add_events():
    if request.is_json:
        event_titles_c.items = []
        incoming_request = request.get_json()
        r = requests.get(url = incoming_request['link'])
        soup   = BeautifulSoup(r.content, 'html.parser')
        quote  = soup.findAll("a")
        quote  = [str(item) for item in quote]
        titles = [item for item in quote if item.startswith("<a href=\"https:")][1:-3]

        start_idx = len("<a href=\"")
        end_idx    = len("</a>")
        for idx,t in enumerate(titles):
            link, event_title = t[start_idx:-end_idx].split(">")
            data_to_append = {"id"   : idx,
                              "links": link,
                              "title": event_title}
            event_titles_c.items.append(data_to_append)
            #print(f'{{"id": {idx},"link":"{link} ,"title":"{event_title}"}},')
        return event_titles_c.items, 201
    return {"error": "Request must be JSON"}, 415