FROM amazon/aws-lambda-nodejs:14
COPY . /var/task/
RUN npm install
RUN npm run build
CMD ["dist/index.handler"]
