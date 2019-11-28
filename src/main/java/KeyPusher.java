import java.awt.*;

public class KeyPusher {
  Robot r;

  KeyPusher() throws AWTException {
    this.r = new Robot();
  }

  int pushKey(int keyCode) throws AWTException, InterruptedException {
    this.r.keyPress(keyCode);
    return keyCode;
  }

  int releaseKey(int keyCode) throws AWTException, InterruptedException {
    this.r.keyRelease(keyCode);
    return keyCode;
  }
}
