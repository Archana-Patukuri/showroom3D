#! /bin/bash
echo "pulling from git-hub"
echo "$1"
git reset --hard HEAD
git pull

echo "\n*\n*\n*\n installing dependencies and building \n*\n*\n*\n"
npm i
npm run build

sudo cp -d -r dist/* /var/www/html/showroom3D/
sudo cp -d -r dist/assets/* /var/www/html/assets/

sudo mkdir -p ~/desktop_demo_versions/version_$1
sudo cp -d -r dist/* ~/desktop_demo_versions/version_$1

echo "\n*\n*\n*\ncopied the files to respective directories\n*\n*\n*\n"

sudo chmod u+x ./testGandivam.sh
