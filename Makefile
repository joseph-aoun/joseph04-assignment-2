ifeq ($(OS),Windows_NT)
    ACTIVATE = call venv\Scripts\activate.bat
    PYTHON = python
    BACKEND_RUN = start /B python backend.py
else
    ACTIVATE = source venv/bin/activate
    PYTHON = python3
    BACKEND_RUN = $(PYTHON) backend.py &
endif

install:
	$(PYTHON) -m venv venv
	$(ACTIVATE) && pip install -r requirements.txt
	cd kmeans-clustering && npm install

run:
	$(ACTIVATE) && $(BACKEND_RUN)
	cd kmeans-clustering && npm start

.PHONY: install run