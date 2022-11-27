# This base image already contains the Amazon Lambda Runtime Interface Client (RIC) for run server in production, and the Runtime Interface Emulator (RIE) for run server locally
FROM amazon/aws-lambda-nodejs:14

RUN yum -y install \
  python3.x86_64 \
  golang.x86_64

RUN node --version && \
  python3 --version && \
  go version

# /tmp is the only writable directory for any lambda function, and golang writes build cache to path defined by this env
ENV XDG_CACHE_HOME '/tmp/.cache'

ENV DEBUG 'app:*'

COPY ["package.json", "package-lock.json*", "${LAMBDA_TASK_ROOT}/"]
RUN npm install

COPY . ${LAMBDA_TASK_ROOT}
RUN npm run build

CMD ["dist/index.handler"]
