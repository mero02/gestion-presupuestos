import requests

def obtener_tasas_cambio() -> dict:
    url = "https://api.exchangerate-api.com/v4/latest/USD"  # Ejemplo de una API para obtener tasas de cambio
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        return data.get("rates", {})
    else:
        raise Exception("Error al obtener las tasas de cambio de la API.")