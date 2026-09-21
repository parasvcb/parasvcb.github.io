"""Run with: python -m unittest discover -s paras -p test_generate.py"""
import copy
import unittest
import generate


class GeneratorTests(unittest.TestCase):
    def setUp(self):
        self.profile = generate.load(generate.ROOT / 'profile.json')
        self.content = generate.load(generate.ROOT / 'content.json')
        self.template = (generate.ROOT / 'index.template.html').read_text(encoding='utf-8')

    def render(self):
        return generate.render(self.profile, self.content, self.template)

    def test_complete_page(self):
        output = self.render()
        self.assertNotIn('{{', output)
        self.assertEqual(output.count('class="publication-item'), 8)
        self.assertIn('<title>Paras Verma, Ph.D. | Computational Biology</title>', output)
        self.assertEqual(output, (generate.ROOT / 'index.html').read_text(encoding='utf-8'))

    def test_edit_and_add_publication(self):
        self.content['profile']['profile_brief_1'] = 'A revised introduction.'
        record = copy.deepcopy(self.content['publications'][0])
        record['venue'] = 'Science & "Evidence"'
        self.content['publications'].append(record)
        output = self.render()
        self.assertIn('A revised introduction.', output)
        self.assertEqual(output.count('class="publication-item'), 9)
        self.assertIn('Science &amp; &quot;Evidence&quot;', output)

    def test_missing_field_and_invalid_link(self):
        self.content['publications'][0]['url'] = 'javascript:alert(1)'
        with self.assertRaises(ValueError):
            self.render()
        del self.profile['meta']['title']
        self.content['publications'] = []
        with self.assertRaises(KeyError):
            self.render()


if __name__ == '__main__':
    unittest.main()
