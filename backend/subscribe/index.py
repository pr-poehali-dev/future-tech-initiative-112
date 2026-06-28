import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Сохраняет email подписчика в базу данных."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    email = (body.get('email') or '').strip().lower()

    if not email or '@' not in email:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Некорректный email'})
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute("SELECT id FROM subscribers WHERE email = %s", (email,))
    if cur.fetchone():
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'status': 'already_subscribed', 'message': 'Вы уже подписаны!'})
        }

    cur.execute("INSERT INTO subscribers (email) VALUES (%s)", (email,))
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'status': 'ok', 'message': 'Вы успешно подписались!'})
    }
