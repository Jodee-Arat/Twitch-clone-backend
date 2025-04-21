import {
  type ArgumentMetadata,
  BadRequestException,
  Injectable,
  type PipeTransform,
} from "@nestjs/common";
import { ReadStream } from "fs";
import { validateFileFormat, validateFileSize } from "../utils/file.util";

@Injectable()
export class FileValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value.filename) {
      throw new BadRequestException("Файл не загружен!");
    }
    const { filename, createReadStream } = value;
    const fileStream = createReadStream() as ReadStream;

    const allowedFileFormats = ["jpg", "jpeg", "png", "webp", "gif"];
    const isFileFormatValid = validateFileFormat(filename, allowedFileFormats);

    if (!isFileFormatValid) {
      throw new BadRequestException("Недопустимый формат файла!");
    }

    const isFileSizeValid = await validateFileSize(
      fileStream,
      10 * 1024 * 1024
    ); // 10 MB

    if (!isFileSizeValid) {
      throw new BadRequestException("Размер файла превышает допустимый лимит!");
    }
    return value;
  }
}
