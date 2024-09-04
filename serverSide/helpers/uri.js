import DataUriparser from 'datauri/parser.js'
import path from "path";

const dataUriParser = new DataUriparser();

const getImageUri = (image) => {
    const fileExtension = path.extname(image.originalname).toString();
    return dataUriParser.format(fileExtension,image.buffer).content;
}

export default getImageUri;
