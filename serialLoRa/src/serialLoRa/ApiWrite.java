package serialLoRa;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.LinkedHashMap;
import java.util.Map;
import jssc.*;

public class ApiWrite implements Runnable, SerialPortEventListener {

	static SerialPort com;
	static String buffer = new String();

	public static void main(String[] pArgs) throws SerialPortException {

		com = new SerialPort("COM7");
		com.openPort();
		com.setParams(SerialPort.BAUDRATE_9600, SerialPort.DATABITS_8, SerialPort.STOPBITS_1, SerialPort.PARITY_NONE);
		com.setFlowControlMode(SerialPort.FLOWCONTROL_RTSCTS_IN | SerialPort.FLOWCONTROL_RTSCTS_OUT);
		com.addEventListener(new ApiWrite(), SerialPort.MASK_RXCHAR);
	}

	public void serialEvent(SerialPortEvent event) {
		if (event.isRXCHAR() && event.getEventValue() > 0) {
			String data;
			try {
				data = com.readString(event.getEventValue());
				manageData(data);
			} catch (IOException | SerialPortException e) {
				e.printStackTrace();
			}
		}
	}

	public void manageData(String data) throws IOException {
		for (int i = 0; i < data.length(); i++) {
			if (data.charAt(i) != '_') {
				buffer += data.charAt(i);
			} else {
				historicCreate();
			}
		}
	}

	public void historicCreate() throws IOException {
		String[] dataSplitted = buffer.split(";");
		URL url = new URL("http://closed.power-heberg.com/RMontagne/api/historic/create.php");
		Map<String, Object> params = new LinkedHashMap<>();
		params.put("id", dataSplitted[0]);
		params.put("alert", dataSplitted[1]);
		params.put("latitude", dataSplitted[2]);
		params.put("longitude", dataSplitted[3]);
		params.put("map", 1);

		StringBuilder postData = new StringBuilder();
		for (Map.Entry<String, Object> param : params.entrySet()) {
			if (postData.length() != 0)
				postData.append('&');
			postData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
			postData.append('=');
			postData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
		}
		byte[] postDataBytes = postData.toString().getBytes("UTF-8");

		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setRequestMethod("POST");
		conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
		conn.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
		conn.setDoOutput(true);
		conn.getOutputStream().write(postDataBytes);

		Reader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

		for (int c; (c = in.read()) >= 0;)
			System.out.print((char) c);
	}

	public void run() {
		try {
			Thread.sleep(1);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
}