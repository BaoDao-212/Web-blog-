import * as ffmpeg from 'fluent-ffmpeg';

export function compressVideo(inputBuffer: Buffer): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const targetBitrate = '500k'; // Bitrate đích (vd: 500 kilobits/s)
    const ffmpegCommand = ffmpeg();

    ffmpegCommand
      .input(inputBuffer)
      .outputOptions(['-b:v', targetBitrate])
      .toFormat('mp4')
      .pipe();

    ffmpegCommand.on('end', () => {
      const outputBuffer = ffmpegCommand._currentOutput._output;
      resolve(outputBuffer);
    });

    ffmpegCommand.on('error', (err) => {
      reject(err);
    });
  });
}
