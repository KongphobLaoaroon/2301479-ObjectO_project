import openai
import logging

class OpenAIRecommendation:
    def __init__(self, api_key, model="gpt-4"):
        self.api_key = api_key
        self.model = model
        openai.api_key = self.api_key
        logging.basicConfig(level=logging.INFO)

    def get_field_of_project(self, project_description, fields_of_research):
        if not project_description or not fields_of_research:
            raise ValueError("Project description and fields of research cannot be empty.")

        prompt = f"Based on the following project description: {project_description}, " \
                 f"which of these fields of research would be most relevant? " \
                 f"Please choose from the following list: {fields_of_research} " \
                 f"and you can answer more than 1 field using commas to separate."

        try:
            response = openai.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "only tell word in the field of research that are exits if dont match tell no field match"},
                    {"role": "user", "content": prompt}
                ]
            )
            response_content = response.choices[0].message.content
            logging.info(f"OpenAI response: {response_content}")

            # Split the response by commas and strip whitespace
            fields_list = [field.strip() for field in response_content.split(',')]
            return fields_list
        except Exception as e:
            logging.error(f"Error getting field of project: {e}")
            return ["Error processing request."]
