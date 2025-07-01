import json
import os

def update_image_paths_in_db():
    """
    Updates the image paths in the db.json file from ThePosterDB URLs
    to local paths (e.g., /images/asset_id.jpg).
    """
    db_file = 'db.json'
    if not os.path.exists(db_file):
        print(f"Error: {db_file} not found. Make sure you are in the 'movie-list' directory.")
        return

    try:
        with open(db_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {db_file}.")
        return

    if 'movies' not in data or not isinstance(data['movies'], list):
        print("Error: 'movies' key not found or is not a list in db.json.")
        return
        
    updated_count = 0
    for movie in data['movies']:
        if isinstance(movie, dict) and 'image' in movie and movie['image']:
            if 'theposterdb.com/api/assets/' in movie['image']:
                asset_id = movie['image'].split('/')[-1]
                new_path = f'/images/{asset_id}.jpg'
                if movie['image'] != new_path:
                    movie['image'] = new_path
                    updated_count += 1

    if updated_count > 0:
        try:
            with open(db_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"Successfully updated {updated_count} image paths in {db_file}.")
            print("The database now points to your local images.")
        except Exception as e:
            print(f"Error writing updates to {db_file}: {e}")
    else:
        print("No image paths needed updating. Your database is already using local paths.")

if __name__ == "__main__":
    update_image_paths_in_db() 