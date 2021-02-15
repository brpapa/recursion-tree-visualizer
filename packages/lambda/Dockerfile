# This base image already contains the Amazon Lambda Runtime Interface Client (RIC) for run server in production, and the Runtime Interface Emulator (RIE) for run server locally

FROM amazon/aws-lambda-nodejs:14
COPY . ${LAMBDA_TASK_ROOT}
RUN npm install
RUN npm run build
CMD ["dist/index.handler"]
