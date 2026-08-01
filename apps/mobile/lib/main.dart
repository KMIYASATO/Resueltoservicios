import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

const _homeUrl = 'https://kmiyasato.github.io/Resueltoservicios/';
const _brandColor = Color(0xFF236A5B);

void main() {
  runApp(const ResueltoApp());
}

class ResueltoApp extends StatelessWidget {
  const ResueltoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Resuelto',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: _brandColor),
        scaffoldBackgroundColor: const Color(0xFFF7FBFA),
        useMaterial3: true,
      ),
      home: const ResueltoWebView(),
    );
  }
}

class ResueltoWebView extends StatefulWidget {
  const ResueltoWebView({super.key});

  @override
  State<ResueltoWebView> createState() => _ResueltoWebViewState();
}

class _ResueltoWebViewState extends State<ResueltoWebView> {
  late final WebViewController _controller;
  var _loading = true;
  var _hasError = false;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFFF7FBFA))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (_) => setState(() {
            _loading = true;
            _hasError = false;
          }),
          onPageFinished: (_) => setState(() => _loading = false),
          onWebResourceError: (_) => setState(() {
            _loading = false;
            _hasError = true;
          }),
        ),
      )
      ..loadRequest(Uri.parse(_homeUrl));
  }

  Future<bool> _handleBack() async {
    if (await _controller.canGoBack()) {
      await _controller.goBack();
      return false;
    }
    return true;
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) async {
        if (didPop) return;
        final shouldClose = await _handleBack();
        if (shouldClose && context.mounted) Navigator.of(context).pop();
      },
      child: Scaffold(
        body: SafeArea(
          child: Stack(
            children: [
              WebViewWidget(controller: _controller),
              if (_loading) const _LoadingOverlay(),
              if (_hasError) _ErrorState(onRetry: () => _controller.loadRequest(Uri.parse(_homeUrl))),
            ],
          ),
        ),
      ),
    );
  }
}

class _LoadingOverlay extends StatelessWidget {
  const _LoadingOverlay();

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: const Color(0xFFF7FBFA),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset('assets/logo.png', width: 172),
            const SizedBox(height: 24),
            const CircularProgressIndicator(color: _brandColor),
          ],
        ),
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.onRetry});

  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: const Color(0xFFF7FBFA),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Image.asset('assets/logo.png', width: 172),
              const SizedBox(height: 20),
              const Text(
                'No se pudo cargar Resuelto',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Color(0xFF16302A)),
              ),
              const SizedBox(height: 8),
              const Text(
                'Revisa tu conexión e intenta nuevamente.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Color(0xFF52665F)),
              ),
              const SizedBox(height: 20),
              FilledButton(
                style: FilledButton.styleFrom(backgroundColor: _brandColor),
                onPressed: onRetry,
                child: const Text('Reintentar'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
