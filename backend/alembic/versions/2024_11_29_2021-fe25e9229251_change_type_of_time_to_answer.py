"""change type of time to answer

Revision ID: fe25e9229251
Revises: 46de7f997d49
Create Date: 2024-11-29 20:21:03.465571

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy.sql import text

# revision identifiers, used by Alembic.
revision: str = 'fe25e9229251'
down_revision: Union[str, None] = '46de7f997d49'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Сохраняем время в формате BigInteger (например, количество секунд с начала дня)
    op.execute(text("""
        ALTER TABLE tests 
        ALTER COLUMN time_to_answer 
        SET DATA TYPE BIGINT 
        USING EXTRACT(EPOCH FROM time_to_answer)::BIGINT
    """))

def downgrade() -> None:
    # Преобразуем BigInteger обратно в TIME
    op.execute(text("""
        ALTER TABLE tests 
        ALTER COLUMN time_to_answer 
        SET DATA TYPE TIME 
        USING (TIMESTAMP 'epoch' + time_to_answer * INTERVAL '1 second')::TIME
    """))