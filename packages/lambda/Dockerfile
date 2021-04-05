# This base image already contains the Amazon Lambda Runtime Interface Client (RIC) for run server in production, and the Runtime Interface Emulator (RIE) for run server locally
FROM amazon/aws-lambda-nodejs:14

RUN yum -y install python3.x86_64
ENV DEBUG 'app:*'

COPY ["package.json", "package-lock.json*", "${LAMBDA_TASK_ROOT}/"]
RUN npm install

COPY . ${LAMBDA_TASK_ROOT}
RUN npm run build

CMD ["dist/index.handler"]
