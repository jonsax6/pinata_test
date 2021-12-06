const fs = require('fs')
const path = require('path')
const pinataSDK = require('@pinata/sdk')

require('dotenv').config()

let pathObj = path.parse(__filename)
console.log(pathObj)

const pinata = pinataSDK(
  '0bb0c044b7a21bf172e3',
  'a0ad52fafb5f13fcda75fc033edae30d78e946775e9383b2f15d24446f79a0be'
)

const createfile = (data) => {
  const jsonString = JSON.stringify(data)
  fs.writeFile(`./metadata/${data.name}.json`, jsonString, (err) => {
    if (err) {
      console.log('Error writing file', err)
    } else {
      console.log('metadata file created successfully')
    }
  })
}

const upload = async () => {
  try {
    const isAuth = await pinata.testAuthentication()

    console.log(isAuth)

    const imageHashUrl = 'https://gateway.pinata.cloud/ipfs/QmarrbvDxqYiH4c266CsHQHVpNhKsZguKnaXiNLuogpR7X'

    const metadata = {
      name: 'artist_test',
      title: 'art_title',
      image: imageHashUrl,
    }

    let jsonObjPath = pathObj.dir

    createfile(metadata)

    const ipfsTransfer = await pinata.pinFileToIPFS(fs.createReadStream(`./metadata/${metadata.name}.json`))

    const filehash = `https://gateway.pinata.cloud/ipfs/${ipfsTransfer.IpfsHash}`
    console.log(filehash)
    return filehash

  } catch (error) {}
}

upload()