import os
import sentimentosController
from dotenv import load_dotenv
load_dotenv()

app = sentimentosController.criar_endpoints(os.getenv('OPENAI_API_KEY'))