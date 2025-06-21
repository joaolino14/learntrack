document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Navigation functionality
    const menuLinks = document.querySelectorAll('.sidebar-menu a');
    const allSections = document.querySelectorAll('.learning-section');
    let currentIndex = 0;

    function showSection(index) {
        if (index < 0 || index >= allSections.length) return;
        
        // Sembunyikan semua section
        allSections.forEach(section => section.classList.remove('active'));
        
        // Tampilkan section yang dipilih
        allSections[index].classList.add('active');
        currentIndex = index;
        
        // Update active link di sidebar
        menuLinks.forEach(link => link.classList.remove('active'));
        
        // Cari link yang sesuai dengan section yang aktif
        const activeSectionId = allSections[index].id;
        const correspondingLink = document.querySelector(`.sidebar-menu a[href="#${activeSectionId}"]`);
        if (correspondingLink) {
            correspondingLink.classList.add('active');
        }
        
        // Scroll ke atas otomatis
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update progress
        updateProgress();
    }

    // Untuk setiap link di sidebar, tambahkan event listener
    menuLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Dapatkan href tanpa hash
            const targetId = this.getAttribute('href').substring(1);
            // Cari index section yang sesuai
            const targetIndex = Array.from(allSections).findIndex(section => section.id === targetId);
            if (targetIndex !== -1) {
                showSection(targetIndex);
            }
        });
    });
    
    // Event delegation untuk tombol next/prev
    document.addEventListener('click', function(e) {
        const nextBtn = e.target.closest('.next-btn');
        const prevBtn = e.target.closest('.prev-btn');
        
        if (nextBtn) {
            showSection(currentIndex + 1);
        } else if (prevBtn) {
            showSection(currentIndex - 1);
        }
    });

    // Code execution functionality
    const runButtons = document.querySelectorAll('.run-btn');
    
    runButtons.forEach(button => {
        button.addEventListener('click', function() {
            const editor = this.closest('.code-editor');
            const editorContent = editor.querySelector('.editor-content').innerText;
            const fileName = editor.querySelector('.file-name').textContent;
            const outputFrame = editor.closest('.lesson-content').querySelector('.code-output');
            
            let fullHtml = '';
            
            if (fileName.includes('.html')) {
                fullHtml = editorContent;
            } 
            else if (fileName.includes('.css')) {
                fullHtml = `<!DOCTYPE html>
                    <html>
                    <head>
                        <title>CSS Preview</title>
                        <style>${editorContent}</style>
                    </head>
                    <body>
                        <h1 style="color: #4F46E5;">Contoh CSS</h1>
                        <p class="example">Ini adalah contoh paragraf.</p>
                        <button class="btn">Tombol Contoh</button>
                    </body>
                    </html>`;
            } 
            else if (fileName.includes('.js')) {
                const htmlEditor = editor.closest('.lesson-content').querySelectorAll('.code-editor')[1];
                const htmlContent = htmlEditor ? htmlEditor.querySelector('.editor-content').innerText : '';
                
                fullHtml = htmlContent.replace('</body>', `<script>${editorContent}</script></body>`);
            }
            
            // Write to iframe
            outputFrame.srcdoc = fullHtml;
        });
    });
    
    // Initialize first section as active
    showSection(0);
    
    // Update progress bar based on completed sections
    function updateProgress() {
        const completed = document.querySelectorAll('.sidebar-menu a.active').length;
        const total = document.querySelectorAll('.sidebar-menu a:not(.menu-category)').length;
        const percentage = Math.round((completed / total) * 100);
        
        document.querySelector('.progress-fill').style.width = `${percentage}%`;
        document.querySelector('.progress-text').textContent = `${percentage}% Complete`;
    }
    
    // Initial progress update
    updateProgress();
});