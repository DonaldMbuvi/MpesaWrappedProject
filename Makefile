create_virtual_environment_and_install_dependencies:
	python3 -m venv venv && source venv/bin/activate && \
	pip install fastapi sqlalchemy psycopg2-binary uvicorn python-multipart
