install:
	python3 -m venv venv
	. venv/bin/activate && pip install -r requirements.txt
	cd kmeans-clustering && npm install

run:
	. venv/bin/activate && python3 backend.py &
	cd kmeans-clustering && npm start
