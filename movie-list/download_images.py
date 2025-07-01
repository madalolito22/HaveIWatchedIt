import os
import json
import requests
from pathlib import Path
import time
from concurrent.futures import ThreadPoolExecutor
from tqdm import tqdm

def download_image(session, asset_id, output_dir):
    """Download a single image from ThePosterDB using a session."""
    url = f"https://theposterdb.com/api/assets/{asset_id}/preview.jpg"
    output_path = os.path.join(output_dir, f"{asset_id}.jpg")
    
    # Skip if image already exists
    if os.path.exists(output_path):
        return True
    
    try:
        response = session.get(url, timeout=15)
        
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                f.write(response.content)
            return True
        else:
            print(f"Failed to download {asset_id}: Status {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"Error downloading {asset_id}: {str(e)}")
        return False

def main():
    # Create images directory if it doesn't exist
    output_dir = os.path.join('public', 'images')
    os.makedirs(output_dir, exist_ok=True)
    
    # Read the movies from db.json
    try:
        with open('db.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            movies = data.get('movies', [])
    except Exception as e:
        print(f"Error reading db.json: {str(e)}")
        return
    
    # Extract asset IDs from movie images
    asset_ids = []
    for movie in movies:
        if isinstance(movie, dict) and movie.get('image') and 'theposterdb.com/api/assets/' in movie['image']:
            asset_id = movie['image'].split('/')[-1]
            asset_ids.append(asset_id)
    
    if not asset_ids:
        print("No images found to download. Please check your db.json file.")
        return
        
    print(f"Found {len(asset_ids)} images to download")

    # Create a session to persist headers
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Accept': 'image/jpeg,image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://theposterdb.com/'
    })
    
    # Download images with progress bar
    successful = 0
    failed = 0
    
    with ThreadPoolExecutor(max_workers=3) as executor: # Reduced workers to be less aggressive
        futures = [executor.submit(download_image, session, asset_id, output_dir) for asset_id in asset_ids]
        
        for future in tqdm(futures, total=len(asset_ids), desc="Downloading images"):
            if future.result():
                successful += 1
            else:
                failed += 1
            time.sleep(0.5)  # Increased delay to be more respectful
    
    print(f"\nDownload complete!")
    print(f"Successfully downloaded: {successful}")
    print(f"Failed to download: {failed}")
    print(f"Images are saved in: {os.path.abspath(output_dir)}")

if __name__ == "__main__":
    main() 