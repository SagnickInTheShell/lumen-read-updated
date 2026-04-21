// Sample content with upgraded data model
// Each paragraph includes: id, text, sentences[], wordCount, estimatedReadingTime

function splitSentences(text) {
  return text.match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()) || [text.trim()];
}

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function estimateReadingTime(wordCount, wpm = 200) {
  return Math.ceil((wordCount / wpm) * 60);
}

function createParagraph(id, text) {
  const sentences = splitSentences(text);
  const wordCount = countWords(text);
  return {
    id,
    text,
    sentences,
    wordCount,
    estimatedReadingTime: estimateReadingTime(wordCount),
  };
}

const sampleContent = {
  title: "The Science of Reading: How Our Brains Process Written Language",
  author: "Lumen Read Editorial",
  paragraphs: [
    createParagraph("p1",
      "Reading is one of the most remarkable achievements of the human brain. Unlike speech, which evolved over millions of years, reading is a relatively recent cultural invention. Our brains were never specifically designed to read, yet billions of people around the world have mastered this extraordinary skill. Understanding how reading works in the brain has profound implications for education, accessibility, and technology."
    ),
    createParagraph("p2",
      "When you look at a word on a page, your visual system first processes the basic shapes and patterns of the letters. This information travels from the retina to the primary visual cortex at the back of your brain. From there, specialized regions begin to recognize familiar letter combinations and word forms. This initial processing happens incredibly fast, often within the first 100 milliseconds of seeing a word."
    ),
    createParagraph("p3",
      "The brain's reading network involves multiple interconnected regions working together in harmony. The left fusiform gyrus, sometimes called the brain's letterbox, becomes specialized for recognizing written words through years of reading practice. Broca's area contributes to the phonological processing of words, essentially sounding them out internally. Meanwhile, Wernicke's area helps extract meaning from the recognized words."
    ),
    createParagraph("p4",
      "One fascinating aspect of reading is how the brain handles different types of words. Familiar words are often recognized as whole units through a process called lexical access. The brain essentially looks them up in its mental dictionary without needing to sound them out letter by letter. Less familiar or new words, on the other hand, require more effortful phonological decoding."
    ),
    createParagraph("p5",
      "Eye movements during reading reveal important patterns about cognitive processing. Your eyes do not move smoothly across text. Instead, they make rapid jumps called saccades, separated by brief pauses called fixations. During fixations, which typically last around 200 to 250 milliseconds, the brain extracts visual information from the text. Skilled readers make fewer and shorter fixations than beginning readers."
    ),
    createParagraph("p6",
      "Reading speed varies significantly among individuals and depends on many factors. The average adult reads between 200 and 300 words per minute for comprehension. However, this rate is influenced by text difficulty, familiarity with the topic, reading purpose, and individual cognitive abilities. Speed reading techniques exist, but research suggests they often sacrifice comprehension for velocity."
    ),
    createParagraph("p7",
      "Dyslexia affects approximately 10 to 15 percent of the population and represents a different pattern of brain organization for reading. Research has shown that individuals with dyslexia often have differences in the left hemisphere language areas. These differences can make phonological processing more challenging, but many people with dyslexia develop compensatory strengths in areas such as spatial reasoning, pattern recognition, and creative thinking."
    ),
    createParagraph("p8",
      "Attention plays a crucial role in reading comprehension. When we read with focused attention, our brains engage deeply with the material, forming connections between new information and existing knowledge. Distraction and mind-wandering during reading significantly reduce comprehension and retention. This is why focused reading environments are so important for learning."
    ),
    createParagraph("p9",
      "The digital age has introduced new considerations for how we read. Screen reading often promotes scanning behavior rather than deep reading. The constant availability of hyperlinks and notifications can fragment attention. However, digital technology also offers powerful tools for improving reading accessibility, such as adjustable fonts, text-to-speech functionality, and adaptive reading interfaces."
    ),
    createParagraph("p10",
      "Working memory capacity affects how much information we can hold and process while reading. Readers with limited working memory may struggle with long, complex sentences because they must hold the beginning of the sentence in mind while processing the end. Breaking text into smaller chunks and using clear sentence structures can substantially improve comprehension for all readers."
    ),
    createParagraph("p11",
      "The concept of cognitive load is particularly relevant to reading. Cognitive load refers to the total amount of mental effort being used in working memory. When text is difficult, poorly structured, or presented in a distracting format, cognitive load increases and comprehension suffers. Good design can reduce extraneous cognitive load, allowing readers to devote more mental resources to understanding the content itself."
    ),
    createParagraph("p12",
      "Research in reading science continues to inform the development of better tools and strategies for readers of all abilities. Adaptive reading systems that respond to individual reading patterns represent an exciting frontier. By monitoring reading behavior such as speed, pauses, and re-reading patterns, these systems can offer personalized suggestions to improve the reading experience. The goal is not to change how people read, but to support each reader's natural process."
    ),
  ],
};

export default sampleContent;
