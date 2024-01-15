<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Color Codes (NodeJS)</title>
  <link rel="stylesheet" href="https://stackedit.io/style.css" />
</head>

<body class="stackedit">
  <div class="stackedit__left">
    <div class="stackedit__toc">
      
<ul>
<li><a href="#color-codes-reference">Color Codes Reference</a>
<ul>
<li><a href="#basic-colors">Basic Colors</a></li>
<li><a href="#text-formatting">Text Formatting</a></li>
<li><a href="#additional-colors">Additional Colors</a></li>
<li><a href="#usage-reminder">Usage Reminder</a></li>
<li><a href="#example">Example</a></li>
</ul>
</li>
</ul>

    </div>
  </div>
  <div class="stackedit__right">
    <div class="stackedit__html">
      <h1 id="color-codes-reference">Color Codes Reference</h1>
<p>This document meticulously outlines each attribute within the <code>colors</code> object, which provides various color codes for enhancing terminal output.</p>
<h2 id="basic-colors">Basic Colors</h2>
<p>These attributes set the foreground text color:</p>
<ul>
<li><strong>red:</strong> <code>\x1b[31m</code></li>
<li><strong>green:</strong> <code>\x1b[32m</code></li>
<li><strong>yellow:</strong> <code>\x1b[33m</code></li>
<li><strong>blue:</strong> <code>\x1b[34m</code></li>
<li><strong>magenta:</strong> <code>\x1b[35m</code></li>
<li><strong>cyan:</strong> <code>\x1b[36m</code></li>
<li><strong>white:</strong> <code>\x1b[37m</code></li>
<li><strong>black:</strong> <code>\x1b[30m</code></li>
</ul>
<h2 id="text-formatting">Text Formatting</h2>
<p>These attributes modify text appearance:</p>
<ul>
<li><strong>bold:</strong> <code>\x1b[1m</code></li>
<li><strong>underline:</strong> <code>\x1b[4m</code></li>
<li><strong>blink:</strong> <code>\x1b[5m</code></li>
<li><strong>reverse:</strong> <code>\x1b[7m</code> (swaps foreground and background colors)</li>
<li><strong>hidden:</strong> <code>\x1b[8m</code> (conceals text)</li>
</ul>
<h2 id="additional-colors">Additional Colors</h2>
<p>These attributes offer a wider spectrum of color choices:</p>
<ul>
<li><strong>Blue:</strong> <code>\u001b[34m</code></li>
<li><strong>Reset:</strong> <code>\u001b[0m</code> (reverts formatting to defaults)</li>
<li><strong>Black:</strong> <code>\u001b[30m</code></li>
<li><strong>Red:</strong> <code>\u001b[31m</code></li>
<li><strong>Green:</strong> <code>\u001b[32m</code></li>
<li><strong>Yellow:</strong> <code>\u001b[33m</code></li>
<li><strong>Magenta:</strong> <code>&amp;lt;0&gt;u001b[35m</code></li>
<li><strong>Cyan:</strong> <code>\u001b[36m</code></li>
<li><strong>White:</strong> <code>\u001b[37m</code></li>
<li><strong>Gray:</strong> <code>\u001b[90m</code></li>
<li><strong>Bright Red:</strong> <code>\u001b[91m</code></li>
<li><strong>Bright Green:</strong> <code>\u001b[92m</code></li>
<li><strong>Bright Yellow:</strong> <code>\u001b[93m</code></li>
<li><strong>Bright Magenta:</strong> <code>\u001b[95m</code></li>
<li><strong>Bright Cyan:</strong> <code>\u001b[96m</code></li>
<li><strong>Bright White:</strong> <code>\u001b[97m</code></li>
<li><strong>Bright Black:</strong> <code>\u001b[30;1m</code></li>
<li><strong>Bright Blue:</strong> <code>\u001b[34;1m</code></li>
<li><strong>Bright Cyan:</strong> <code>\u001b[36;1m</code></li>
<li><strong>Bright Magenta:</strong> <code>\u001b[35;1m</code></li>
<li><strong>Bright White:</strong> <code>\u001b[37;1m</code></li>
<li><strong>Bright Yellow:</strong> <code>\u001b[33;1m</code></li>
<li><strong>Bright Gray:</strong> <code>\u001b[90;1m</code></li>
<li><strong>Dark Gray:</strong> <code>\u001b[90;2m</code></li>
</ul>
<h2 id="usage-reminder">Usage Reminder</h2>
<p>To apply these colors and effects in JavaScript:</p>
<ol>
<li>Access the desired code from the <code>colors</code> object (e.g., <code>colors.red</code>).</li>
<li>Embed the code within a string literal before the text to be formatted.</li>
<li>Use the <code>Reset</code> code after the text to restore default formatting.</li>
</ol>
<h2 id="example">Example</h2>
<pre class=" language-js"><code class="prism  language-js"><span class="token keyword">const</span> colors <span class="token operator">=</span> <span class="token punctuation">{</span>
	red<span class="token punctuation">:</span> <span class="token string">"\x1b[31m"</span><span class="token punctuation">,</span>
	green<span class="token punctuation">:</span> <span class="token string">"\x1b[32m"</span><span class="token punctuation">,</span>
	yellow<span class="token punctuation">:</span> <span class="token string">"\x1b[33m"</span><span class="token punctuation">,</span>
	blue<span class="token punctuation">:</span> <span class="token string">"\x1b[34m"</span><span class="token punctuation">,</span>
	magenta<span class="token punctuation">:</span> <span class="token string">"\x1b[35m"</span><span class="token punctuation">,</span>
	cyan<span class="token punctuation">:</span> <span class="token string">"\x1b[36m"</span><span class="token punctuation">,</span>
	white<span class="token punctuation">:</span> <span class="token string">"\x1b[37m"</span><span class="token punctuation">,</span>
	black<span class="token punctuation">:</span> <span class="token string">"\x1b[30m"</span><span class="token punctuation">,</span>
	reset<span class="token punctuation">:</span> <span class="token string">"\x1b[0m"</span><span class="token punctuation">,</span>
	bold<span class="token punctuation">:</span> <span class="token string">"\x1b[1m"</span><span class="token punctuation">,</span>
	underline<span class="token punctuation">:</span> <span class="token string">"\x1b[4m"</span><span class="token punctuation">,</span>
	blink<span class="token punctuation">:</span> <span class="token string">"\x1b[5m"</span><span class="token punctuation">,</span>
	reverse<span class="token punctuation">:</span> <span class="token string">"\x1b[7m"</span><span class="token punctuation">,</span>
	hidden<span class="token punctuation">:</span> <span class="token string">"\x1b[8m"</span><span class="token punctuation">,</span>
	Blue<span class="token punctuation">:</span> <span class="token string">"\u001b[34m"</span><span class="token punctuation">,</span>
	Reset<span class="token punctuation">:</span> <span class="token string">"\u001b[0m"</span><span class="token punctuation">,</span>
	Black<span class="token punctuation">:</span> <span class="token string">"\u001b[30m"</span><span class="token punctuation">,</span>
	Red<span class="token punctuation">:</span> <span class="token string">"\u001b[31m"</span><span class="token punctuation">,</span>
	Green<span class="token punctuation">:</span> <span class="token string">"\u001b[32m"</span><span class="token punctuation">,</span>
	Yellow<span class="token punctuation">:</span> <span class="token string">"\u001b[33m"</span><span class="token punctuation">,</span>
	Magenta<span class="token punctuation">:</span> <span class="token string">"\u001b[35m"</span><span class="token punctuation">,</span>
	Cyan<span class="token punctuation">:</span> <span class="token string">"\u001b[36m"</span><span class="token punctuation">,</span>
	White<span class="token punctuation">:</span> <span class="token string">"\u001b[37m"</span><span class="token punctuation">,</span>
	Gray<span class="token punctuation">:</span> <span class="token string">"\u001b[90m"</span><span class="token punctuation">,</span>
	<span class="token string">"Bright Red"</span><span class="token punctuation">:</span> <span class="token string">"\u001b[91m"</span><span class="token punctuation">,</span>
	<span class="token string">"Bright Green"</span><span class="token punctuation">:</span> <span class="token string">"\u001b[92m"</span><span class="token punctuation">,</span>
	<span class="token string">"Bright Yellow"</span><span class="token punctuation">:</span> <span class="token string">"\u001b[93m"</span><span class="token punctuation">,</span>
	<span class="token string">"Bright Magenta"</span><span class="token punctuation">:</span> <span class="token string">"\u001b[95m"</span><span class="token punctuation">,</span>
	<span class="token string">"Bright Cyan"</span><span class="token punctuation">:</span> <span class="token string">"\u001b[96m"</span><span class="token punctuation">,</span>
	<span class="token string">"Bright White"</span><span class="token punctuation">:</span> <span class="token string">"\u001b[97m"</span><span class="token punctuation">,</span>
	<span class="token string">"Bright Black"</span><span class="token punctuation">:</span> <span class="token string">"\u001b[30;1m"</span><span class="token punctuation">,</span>
	<span class="token string">"Bright Blue"</span><span class="token punctuation">:</span> <span class="token string">"\u001b[34;1m"</span><span class="token punctuation">,</span>
	<span class="token string">"Bright Cyan"</span><span class="token punctuation">:</span> <span class="token string">"\u001b[36;1m"</span><span class="token punctuation">,</span>
	<span class="token string">"Bright Magenta"</span><span class="token punctuation">:</span> <span class="token string">"\u001b[35;1m"</span><span class="token punctuation">,</span>
	<span class="token string">"Bright White"</span><span class="token punctuation">:</span> <span class="token string">"\u001b[37;1m"</span><span class="token punctuation">,</span>
	<span class="token string">"Bright Yellow"</span><span class="token punctuation">:</span> <span class="token string">"\u001b[33;1m"</span><span class="token punctuation">,</span>
	<span class="token string">"Bright Gray"</span><span class="token punctuation">:</span> <span class="token string">"\u001b[90;1m"</span><span class="token punctuation">,</span>
	<span class="token string">"Dark Gray"</span><span class="token punctuation">:</span> <span class="token string">"\u001b[90;2m"</span>
<span class="token punctuation">}</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>colors<span class="token punctuation">.</span>red<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">Red text.</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>colors<span class="token punctuation">.</span>Reset<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// "Red text" in red.</span>
</code></pre>
<blockquote>
<p>Written with <a href="https://stackedit.io/">StackEdit</a>.</p>
</blockquote>

    </div>
  </div>
</body>

</html>
