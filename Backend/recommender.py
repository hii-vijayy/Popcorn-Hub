from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import os
import json

class MovieRecommender:
    def __init__(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        movies_path = os.path.join(current_dir, '../datasets/tmdb_5000_movies.csv')
        credits_path = os.path.join(current_dir, '../datasets/tmdb_5000_credits.csv')
        
        self.df = pd.read_csv(movies_path)
        self.credits = pd.read_csv(credits_path)
        self.create_similarity_matrix()
    
    def create_similarity_matrix(self):
        # Merge datasets and preprocess
        self.df = self.df.merge(self.credits, on='title')
        
        self.df['genres'] = self.df['genres'].apply(self._extract_genres)
        self.df['keywords'] = self.df['keywords'].apply(self._extract_keywords)

        # Fill NaNs and ensure string type
        self.df[['overview', 'genres', 'keywords']] = self.df[['overview', 'genres', 'keywords']].fillna('').astype(str)
        
        # Create tags
        self.df['tags'] = self.df['overview'] + ' ' + self.df['genres'] + ' ' + self.df['keywords']

        # Vectorization
        self.cv = CountVectorizer(max_features=5000, stop_words='english')
        vectors = self.cv.fit_transform(self.df['tags']).toarray()

        # Cosine similarity
        self.similarity = cosine_similarity(vectors)

    def _extract_genres(self, genres_str):
        try:
            genres_list = json.loads(genres_str.replace("'", '"'))
            return ' '.join([genre['name'] for genre in genres_list])
        except:
            return ""

    def _extract_keywords(self, keywords_str):
        try:
            keywords_list = json.loads(keywords_str.replace("'", '"'))
            return ' '.join([keyword['name'] for keyword in keywords_list])
        except:
            return ""

    def recommend(self, title):
        try:
            idx = self.df[self.df['title'] == title].index[0]
            distances = sorted(list(enumerate(self.similarity[idx])), reverse=True, key=lambda x: x[1])

            recommendations = []
            for i in distances[1:6]:
                movie_info = {
                    'id': int(self.df.iloc[i[0]].id),
                    'title': self.df.iloc[i[0]].title,
                    'poster_path': self.df.iloc[i[0]].poster_path if 'poster_path' in self.df.columns else None
                }
                recommendations.append(movie_info)

            return recommendations
        except IndexError:
            return []
