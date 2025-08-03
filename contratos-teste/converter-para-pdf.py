#!/usr/bin/env python3
"""
Script para converter HTMLs dos contratos para PDF
Usando WeasyPrint ou reportlab como fallback
"""

import os
import sys

def convert_with_weasyprint():
    """Converte usando WeasyPrint (melhor qualidade)"""
    try:
        from weasyprint import HTML
        
        files = [
            'contrato-exploracao-sustentavel.html',
            'contrato-transporte-petroleo.html', 
            'contrato-refinaria-distribuicao.html'
        ]
        
        for html_file in files:
            if os.path.exists(html_file):
                pdf_file = html_file.replace('.html', '.pdf')
                HTML(filename=html_file).write_pdf(pdf_file)
                print(f"Convertido: {pdf_file}")
            else:
                print(f"Arquivo nao encontrado: {html_file}")
                
        return True
    except ImportError:
        print("WeasyPrint nao disponivel")
        return False

def convert_with_subprocess():
    """Converte usando Chrome/Edge via subprocess"""
    try:
        import subprocess
        
        files = [
            'contrato-exploracao-sustentavel.html',
            'contrato-transporte-petroleo.html',
            'contrato-refinaria-distribuicao.html'
        ]
        
        # Tenta diferentes comandos para Chrome/Edge
        chrome_commands = [
            'chrome',
            'google-chrome',  
            'chromium',
            'msedge',
            r'C:\Program Files\Google\Chrome\Application\chrome.exe',
            r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
        ]
        
        chrome_cmd = None
        for cmd in chrome_commands:
            try:
                subprocess.run([cmd, '--version'], capture_output=True, check=True)
                chrome_cmd = cmd
                break
            except:
                continue
                
        if not chrome_cmd:
            print("Nenhum navegador encontrado")
            return False
            
        for html_file in files:
            if os.path.exists(html_file):
                pdf_file = html_file.replace('.html', '.pdf')
                abs_html = os.path.abspath(html_file)
                abs_pdf = os.path.abspath(pdf_file)
                
                cmd = [
                    chrome_cmd,
                    '--headless',
                    '--disable-gpu',
                    '--no-sandbox',
                    f'--print-to-pdf={abs_pdf}',
                    f'file://{abs_html}'
                ]
                
                result = subprocess.run(cmd, capture_output=True, text=True)
                if result.returncode == 0:
                    print(f"Convertido: {pdf_file}")
                else:
                    print(f"Erro ao converter {html_file}: {result.stderr}")
            else:
                print(f"Arquivo nao encontrado: {html_file}")
                
        return True
    except Exception as e:
        print(f"Erro no subprocess: {e}")
        return False

def main():
    print("Convertendo contratos HTML para PDF...")
    
    # Tenta WeasyPrint primeiro
    if convert_with_weasyprint():
        print("Conversao concluida com WeasyPrint!")
        return
        
    # Fallback para browser
    if convert_with_subprocess():
        print("Conversao concluida com navegador!")
        return
        
    # Se nada funcionar, instrui o usuário
    print("Nao foi possivel converter automaticamente.")
    print("\nInstrucoes manuais:")
    print("1. Abra cada arquivo .html no seu navegador")
    print("2. Use Ctrl+P para imprimir")
    print("3. Escolha 'Salvar como PDF'")
    print("4. Salve com o mesmo nome, extensao .pdf")

if __name__ == '__main__':
    main()