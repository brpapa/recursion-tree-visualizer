FROM amazon/aws-lambda-nodejs:14
COPY . ${LAMBDA_TASK_ROOT}
RUN npm install
RUN npm run build
WORKDIR ./dist
CMD ["index.handler"]
