import { useEffect, useState, useCallback  } from "react";
import { methods } from './MethodSelector';


interface GenerateCodeProps {
  language: string;
  method: (typeof methods)[number];
  url: string;
  body: string;
}

interface RequestData {
  url: string;
  method: string;
  body: string;
}

type GeneratorFn = (data: RequestData) => string;

const codeGenerators: Record<"GET" | "DEFAULT", Record<string, GeneratorFn>> = {
  GET: {
    curl: ({ method, url }) => `curl -X ${method} ${url}`,
    jsFetch: ({ method, url }) => `fetch('${url}', {\n  method: '${method}',\n}).then(response => response.json());`,
    xhr: ({ method, url }) => `var xhr = new XMLHttpRequest();\nxhr.open('${method}', '${url}');\nxhr.send();`,
    nodejs: ({ method, url }) => `const fetch = require('node-fetch');\nfetch('${url}', {\n  method: '${method}',\n})\n.then(response => response.json())\n.then(data => console.log(data));`,
    python: ({ method, url }) => `import requests\nresponse = requests.${method.toLowerCase()}('${url}')\nprint(response.status_code)`,
    java: ({ method, url }) => `HttpURLConnection connection = (HttpURLConnection) new URL("${url}").openConnection();\nconnection.setRequestMethod("${method}");\nconnection.getResponseCode();`,
    csharp: ({ method, url }) => `HttpClient client = new HttpClient();\nvar response = await client.${method.toLowerCase()}("${url}");\nConsole.WriteLine(response.StatusCode);`,
    go: ({ url }) => `package main\nimport "net/http"\nimport "fmt"\n\nfunc main() {\n    resp, _ := http.Get("${url}")\n    fmt.Println(resp.StatusCode)\n}`,
  },
  DEFAULT: {
    curl: ({ method, url, body }) => `curl -X ${method} ${url} -H "Content-Type: application/json" -d '${body}'`,
    jsFetch: ({ method, url, body }) => `fetch('${url}', {\n  method: '${method}',\n  headers: { 'Content-Type': 'application/json' },\n  body: '${body}',\n}).then(response => response.json());`,
    xhr: ({ method, url, body }) => `var xhr = new XMLHttpRequest();\nxhr.open('${method}', '${url}');\nxhr.setRequestHeader('Content-Type', 'application/json');\nxhr.send('${body}');`,
    nodejs: ({ method, url, body }) => `const fetch = require('node-fetch');\nfetch('${url}', {\n  method: '${method}',\n  headers: { 'Content-Type': 'application/json' },\n  body: '${body}',\n})\n.then(response => response.json())\n.then(data => console.log(data));`,
    python: ({ method, url, body }) => `import requests\nresponse = requests.${method.toLowerCase()}('${url}', json=${body})\nprint(response.json())`,
    java: ({ method, url, body }) => `HttpURLConnection connection = (HttpURLConnection) new URL("${url}").openConnection();\nconnection.setRequestMethod("${method}");\nconnection.setRequestProperty("Content-Type", "application/json");\nconnection.getOutputStream().write("${body}".getBytes());`,
    csharp: ({ method, url, body }) => `HttpClient client = new HttpClient();\nvar response = await client.${method.toLowerCase()}("${url}", new StringContent("${body}", Encoding.UTF8, "application/json"));\nstring result = await response.Content.ReadAsStringAsync();\nConsole.WriteLine(result);`,
    go: ({ method, url, body }) => `package main\nimport "net/http"\nimport "io/ioutil"\nimport "bytes"\nimport "fmt"\n\nfunc main() {\n    req, _ := http.NewRequest("${method}", "${url}", bytes.NewBuffer([]byte("${body}")))\n    req.Header.Set("Content-Type", "application/json")\n    client := &http.Client{}\n    resp, _ := client.Do(req)\n    body, _ := ioutil.ReadAll(resp.Body)\n    fmt.Println(string(body))\n}`,
  },
};

const GenerateCode = ({ language, method, url, body }: GenerateCodeProps) => {
  const [data, setData] = useState<RequestData>({ url, method, body });
  const [generatedCode, setGeneratedCode] = useState("");
  const [error, setError] = useState("");

  const generateCode = useCallback(() => {
    if (!data.url || !data.method) {
      setError("There are not enough details for the code to be generated");
      return;
    }

    const group = data.method === "GET" ? "GET" : "DEFAULT";
    const generator = codeGenerators[group][language];

    if (!generator) {
      setError("Invalid language selected");
      return;
    }

    setGeneratedCode(generator(data));
    setError("");
  }, [data, language]);

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      method,
      url
    }));
  }, [method, url]);

  useEffect(() => {
    if (data.url && data.method) {
      generateCode();
    }
  }, [data.url, data.method, language, generateCode]);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {generatedCode && <pre>{generatedCode}</pre>}
    </div>
  );
};

export default GenerateCode;
