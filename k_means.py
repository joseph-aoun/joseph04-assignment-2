from random import randint as rand
import matplotlib.pyplot as plt

class KMeans:
    
    def __init__(self, k, data, n = 200, initialization_method = 'random', centroids = []):
        self.k = k # number of clusters
        self.n = n # number of data points
        self.clusters = [-1] * n # cluster assignment for each data point
        self.data = data
        self.centroids = self.initialize(initialization_method, data) if initialization_method != 'manual' else centroids # cluster centroids
        self.snapshots = [] # contains at each step, the clusters as well as the centroids 
        
    def generate_data(self):
        data = [(rand(-100, 100), rand(-100, 100)) for _ in range(200)]
        return data
    
    def dist(self, a, b):
        return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2
    
    def assign_clusters(self):
        for i in range(self.n):
            min_dist = float('inf')
            for j in range(self.k):
                d = self.dist(self.data[i], self.centroids[j])
                if d < min_dist:
                    min_dist = d
                    self.clusters[i] = j
                    
    def update_centroids(self):
        for i in range(self.k):
            x, y = 0, 0
            count = 0
            for j in range(self.n):
                if self.clusters[j] == i:
                    x += self.data[j][0]
                    y += self.data[j][1]
                    count += 1
            if count > 0:
                self.centroids[i] = (x / count, y / count)

    def initialize(self, method, data):
        if method == 'random':
            return [data[rand(0, self.n-1)] for _ in range(self.k)]
        
        if method == 'kmeans++':
            centroids = []
            centroids.append(data[rand(0, self.n)])
            for _ in range(1, self.k):
                dists = []
                for i in range(self.n):
                    min_dist = float('inf')
                    for j in range(len(centroids)):
                        d = self.dist(data[i], centroids[j])
                        if d < min_dist:
                            min_dist = d
                    dists.append(min_dist)
                total = sum(dists)
                r = rand(0, total)
                s = 0
                for i in range(self.n):
                    s += dists[i]
                    if s >= r:
                        centroids.append(data[i])
                        break
            return centroids
        
        if method == 'farthest_first':
            centroids = []
            centroids.append(data[rand(0, self.n)])
            for _ in range(1, self.k):
                dists = []
                for i in range(self.n):
                    min_dist = float('inf')
                    for j in range(len(centroids)):
                        d = self.dist(data[i], centroids[j])
                        if d < min_dist:
                            min_dist = d
                    dists.append(min_dist)
                max_dist = max(dists)
                for i in range(self.n):
                    if dists[i] == max_dist:
                        centroids.append(data[i])
                        break
            return centroids
        
    
    def run(self):
        self.assign_clusters()
        self.snapshots.append((self.clusters[:], self.centroids[:]))
        while True:
            self.assign_clusters()
            self.update_centroids()
            self.snapshots.append((self.clusters[:], self.centroids[:]))
            if self.snapshots[-1] == self.snapshots[-2]:
                break
        return self.snapshots
    
    def show_clusters(self, snapshot_idx = -1):
        
        colors = ['r', 'g', 'b', 'y', 'c', 'm', 'k', 'orange', 'purple', 'brown']
        clusters, centroids = self.snapshots[snapshot_idx]
        
        for i in range(self.k):
            x, y = [], []
            for j in range(self.n):
                if clusters[j] == i:
                    x.append(self.data[j][0])
                    y.append(self.data[j][1])
            plt.scatter(x, y, color = colors[i])
        
        for i in range(self.k):
            plt.scatter(centroids[i][0], centroids[i][1], color = 'black', marker = 'x')
        
        plt.show()

# k = 10
# centroids = [(rand(-100, 100), rand(-100, 100)) for _ in range(k)]
# kmeans = KMeans(k, KMeans.generate_data(300), initialization_method = 'farthest_first', centroids = centroids)
# snapshots = kmeans.run()
# for i in range(len(snapshots)):
#     kmeans.show_clusters(i)