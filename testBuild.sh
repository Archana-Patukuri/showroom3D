#! /bin/bash
echo "pulling from git-hub"
echo "$1"
git reset --hard HEAD
git pull

echo "\n*\n*\n*\ninstalling dependencies and building \n*\n*\n*\n*\n* "
npm i
npm run build

sudo cp -d -r dist/* ~/website/VC_Website_Ver8_Tailwind/server/public/showroom3d_desktop
sudo cp -d -r dist/assets/* ~/website/VC_Website_Ver8_Tailwind/server/public/assets/

sudo mkdir -p ~/desktop_demo_versions/version_$1
sudo cp -d -r dist/* ~/desktop_demo_versions/version_$1

echo "\n*\n*\n*\ncopied the files to respective directories\n*\n*\n*\n"

sudo chmod u+x ./testBuild.sh
