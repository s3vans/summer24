Prereqs on Mac:

  * Install homebrew.
  * `brew install ffmpeg`

To split a mp4 to frames:

  * `ffmpeg -i PXL_20260104_135456564.mp4 frame%04d.png`

We manually renamed 9 key frames from 0001 to 0009.

We previewed the frames by recombingin them into a 10 fps video using:

  * `ffmpeg -r 10 -f image2 -s 540x540 -i "frame%04d.png" -vcodec libx264 -crf 17 -pix_fmt yuv420p output.mp4`
  * Note that the dimension seemed to be ignored.

To host this prototype tool:

  * `python3 -m http.server`

Some bugs that we encountered:

  * We only need to loadPixels in setup. Doing it in each draw loop was causing
    black pixels when drawing an image with transparency more than once.
  * Not to mention that iterating through the pixels was very expensive due to
    the high res of our images.
  * Removing the green screen backround is a WIP. High "green" values are more
    relevant when they are much larger than the "blue" and "red" values. We
    got a good result through exploration and happy accidents, but it will need
    further tuning.

The goal is:

  * Capture video at the green screen.
  * Extract frames and identify key frames.
  * Using key frames animation, identify bounding box.
  * Filter out green screen from key frames bounding box.
  * Produce a PNG and config usable by our aninmation library.
 
