#!/usr/bin/env python3
"""
Register Telegram Bot Webhook script for ResolveIQ.
Usage: python scripts/set_webhook.py <WEBHOOK_URL>
"""
import sys
import os
import httpx

def set_webhook(base_url: str):
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    secret_token = os.getenv("TELEGRAM_WEBHOOK_SECRET", "resolveiq_secret_token")
    
    if not bot_token:
        print("[WARNING] TELEGRAM_BOT_TOKEN is not set in environment. Skipping webhook registration.")
        return False
        
    webhook_url = f"{base_url.rstrip('/')}/webhooks/telegram"
    api_url = f"https://api.telegram.org/bot{bot_token}/setWebhook"
    
    print(f"Configuring Telegram Webhook to: {webhook_url}")
    try:
        response = httpx.post(
            api_url,
            json={"url": webhook_url, "secret_token": secret_token},
            timeout=10.0
        )
        print("Telegram API Response:", response.json())
        return response.status_code == 200
    except Exception as e:
        print(f"Error registering webhook: {e}")
        return False

if __name__ == "__main__":
    target_url = sys.argv[1] if len(sys.argv) > 1 else "https://api.resolveiq.gov.in"
    set_webhook(target_url)

