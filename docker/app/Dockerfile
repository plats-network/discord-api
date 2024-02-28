FROM node:19.6.0

ARG work_dir=/var/www
RUN mkdir ${work_dir}

WORKDIR ${work_dir}

COPY package.json .

RUN npm install

COPY . ${work_dir}

EXPOSE 3000

CMD ["yarn", "start"]