docker compose down
docker images
echo ''
docker rm -vf $(docker ps -aq)
docker rmi -f $(docker images -aq)
docker images
# echo 'Created directory'
# sdocker compose up --build
# docker network prune
# docker compose up --remove-orphans